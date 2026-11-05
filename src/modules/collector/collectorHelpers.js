export function createCollectorHelpers(state, { request, loading, later }) {
  return {
    postDecision(endpoint, selected, message) {
      if (!selected.length) { alert('Please select at least one application.'); return }
      if (!confirm(message)) return
      loading.start()
      request.post(endpoint, selected).success(data => {
        loading.finish()
        state.responseObject = data
        later(() => { state.responseObject = {} }, 5000)
        state.loadApplications()
      }).error(() => loading.finish())
    },
    buildBean() {
      const html = state.batchPdfHtml || state.esignLetterHtml || ''
      if (state.error || !state.esignReady || !state.appNoList() || !html.trim()) throw new Error('Load and review the complete approval document before signing.')
      return { type: 'COLLECTOR_APPROVAL', applicantNumber: state.appNoList(), aadhaarLast4Digits: state.aadhaarLast4Digits,
        remark: 'Collector approval', title: 'Digital Signature', unsignedBase64: html }
    },
    submitGateway(data) {
      const gateway = new URL(data.aspUrl)
      if (gateway.protocol !== 'https:' || gateway.username || gateway.password || !data.eHastaksharHiddenInputTAG) throw new Error('The signing gateway response is invalid.')
      const form = document.createElement('form')
      form.method = 'POST'; form.action = gateway.href; form.hidden = true
      const input = document.createElement('input')
      input.type = 'hidden'; input.name = 'msg'; input.value = data.eHastaksharHiddenInputTAG
      form.appendChild(input); document.body.appendChild(form); form.submit()
    },
  }
}
