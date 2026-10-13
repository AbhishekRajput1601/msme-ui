



        $(document).ready(function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 200) {
                    $('#scrollTopBtn').fadeIn();
                } else {
                    $('#scrollTopBtn').fadeOut();
                }
            });

            $('#scrollTopBtn').click(function () {
                $('html, body').animate({ scrollTop: 0 }, 600);
                return false;
            });

            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            document.getElementById("currentDate").textContent = `${day}/${month}/${year}`;
        });
    

        function changeStyle() {
            const el = document.getElementById('myDiv');
            el.style.marginRight = '-320px';
            el.style.marginTop = '-90px';
            el.style.fontWeight = 'bold';
        }

        $(function () {
            $('.btn-sign').click(function () {
                $('#myDiv2').addClass('myDiv');
            });
        });
    

        $(function () {
            $('#datetimepicker1, #datetimepicker2, #datetimepicker3, #datetimepicker4').datetimepicker({
                maxDate: moment(),
                format: 'DD/MM/YYYY',
                useCurrent: false
            });

            $('#add-new-item-popup').on("shown.bs.modal", function () {
                var index = $('#id').val();
                var type = $('#type').val();
                $('#id').scope().addWorkEstimationItemEntryChild(index, type);
            });

            $(document).on("click", ".test", function () {
                var id_value = $(this).data('id');
                var type_value = $(this).data('type');
                $("#id").val(id_value);
                $("#type").val(type_value);
            });
        });
    