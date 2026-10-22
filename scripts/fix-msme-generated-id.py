from pathlib import Path

target = Path('E:/eclipse/MSME%20-%20LAND%20ALLOTMENT%20AND%20FINANCIAL%20ASSISTANCE/mpindustry-msme/src/main/java/com/mapit/mpindustry/msme/dao/impl/MSMEDTICDaoImpl.java')
source = target.read_bytes()
old = b'\t\tsession.merge(msmeDetailEntity);'
newline = b'\r\n' if b'\r\n' in source else b'\n'
new = newline.join([
    b'\t\tMsmeDetail managed = session.merge(msmeDetailEntity);',
    b'\t\t// merge assigns generated IDs to the managed copy, not the input entity.',
    b'\t\tmsmeDetailEntity.setMsmeDetailId(managed.getMsmeDetailId());',
])
start = source.index(b'public void saveOrUpdateMSMEDetail(')
end = source.index(b'public void mergeMSMEDetail(', start)
section = source[start:end]
if new in section:
    print('Generated-ID fix already applied.')
else:
    if section.count(old) != 1:
        raise SystemExit('Unexpected DAO source; no files changed.')
    target.write_bytes(source[:start] + section.replace(old, new, 1) + source[end:])
    print('Fixed MSME save response to use the ID returned by Hibernate merge.')
