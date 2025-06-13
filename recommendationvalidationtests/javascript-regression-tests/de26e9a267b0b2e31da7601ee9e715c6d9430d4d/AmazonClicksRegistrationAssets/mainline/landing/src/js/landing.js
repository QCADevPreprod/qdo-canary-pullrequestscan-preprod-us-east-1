P.when('A', 'a-popover', 'a-modal', 'payment-workflow', 'ready').execute(function (A, popover,
                                                                                   modal, paymentWorkflow) {
        var $ = A.$;
        var redirectUrl = "/cb";
        var isPaused = true;

        // iterate through the register button class to find the clicked button and redirectUrl.
        //If there is no redirectUrl, redirect users to /cm page.
        var registerbuttons = document.querySelectorAll('.seller-register-button');
        [].forEach.call(registerbuttons, function(button) {
            button.addEventListener('click', function() {
                $('button', '.seller-register-button').hide();
                $('.getStartedError','.seller-register-button').hide();
                $('.a-spinner').css('display', 'inline-block');
                $('.seller-register-link').hide();
                if(button.dataset.redirecturl) {
                    redirectUrl = button.dataset.redirecturl;
                }
                checkIfClicked();
            })
        });

        function checkIfClicked() {
            var ajaxHandler = {
                url    : '/clicks/registration/isClicked',
                method : "get",
                success: function(isClicked) {
                    // For posterity: this is here because when we were testing beta
                    // beta for some reason responds with a string of "false" which evaluates to true and breaks the code
                    // prod for some reason responds with a boolean of false which works correctly.
                    if ((typeof isClicked == 'boolean' && isClicked)
                        || (typeof isClicked == 'string' && isClicked == 'true')) {
                        window.location.href = redirectUrl;
                    } else {
                        paymentWorkflow.useUnifiedBilling(9);
                    }
                },
                error: function() {
                    A.trigger('ac_registration_failed');
                }
            };
            A.ajax(ajaxHandler.url, ajaxHandler);
        }

        // This function is executed on click of any link. Currently performs the same function
        // as button click.

        $( ".seller-register-link" ).click(function(event) {

            event.preventDefault();

            try{
                var data = $(event.target).parent().parent();
                redirectUrl = data[0].dataset.redirecturl;

                $('button','.seller-register-button').hide();
                $('.getStartedError','.seller-register-button').hide();
                $('.a-spinner').css('display', 'inline-block');
                $('.seller-register-link').hide();

                paymentWorkflow.useUnifiedBilling(9);
            }catch(err){
                throw new Error("Failed to parse redirect URL from click on Seller registration link: " +err);
            }
        });

        setupCategoriesPopover();

        function handleError() {
            $('button','.seller-register-button').show();
            $('.a-spinner','.seller-register-button').hide();
            $('.getStartedError','.seller-register-button').css('display', 'inline-block');
        }

        $(".testimonialVideo").each(function () {
            var videoThumb = $(this);
            var videoThumbId = videoThumb.attr("id");
            var videoModalId = "#modal-" + videoThumbId;
            var videoModalContainer = "testimonialVideoModal";

            var trigger = videoThumb;
            var options = {
                "name": videoModalContainer,
                "inlineContent": $(videoModalId).html(),
                "activate": "onclick",
                "hideHeader": "true",
                "width": "80%",
                "height": "80%"
            };

            modal.create(trigger, options);
            var modalHideEvent = "a:popover:hide:" + videoModalContainer;
            A.on(modalHideEvent, function () {
                var modalObject = $("#" + videoModalContainer);
                // Sometimes HTML5 video, sometimes YouTube iframe.
                var isIFrame = false;
                var video = modalObject.find('video')[0];

                if (!video) {
                    isIFrame = true;
                    video = modalObject.find('iframe')[0]
                }

                if (typeof video !== 'object') {
                    throw new Error('No video or iframe element exists in ' +
                        ' the video container.');
                }

                // HTML5 video makes life easy. iframe does not.
                if (isIFrame) {
                    video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                } else {
                    video.pause();
                }
            });
        });

        A.on('ac_use_ub_failed', handleError);
        A.on('ac_registration_success', function() {
            trackingPixelsHomeAds();
            trackingPixelsOffAmazon();

            var params = new URLSearchParams(window.location.search);
            var ucbIngressUrlParams = ['source', 'startdate', 'enddate', 'asins', 'skus', 'isAuto'];

            ucbIngressUrlParams.forEach(function (param) {
                if (params.get(param)) {
                    redirectUrl += '&' + param + '=' + params.get(param);
                }
            });

            window.location.href = redirectUrl;
        });

        A.on('ac_registration_failed', handleError);

        function setupCategoriesPopover() {
            var trigger = $("#categoriesLink");
            var options = {
                "inlineContent": $("#categoriesPopover").html(),
                "position": "triggerRight",
                "activate": "onclick"
            };

            popover.create(trigger, options);
        }

        function trackingPixelsHomeAds() {
            var _pix = document.getElementById('_pix_id');
            if (!_pix) {
                var protocol = '//';
                var a = Math.random() * 1000000000000000000;
                _pix = document.createElement('img');
                _pix.setAttribute('src', protocol + 's.amazon-adsystem.com/iu3?d=forester-did&ex-fargs=%3Fid%3D14e065ac-d355-628d-ee6f-3d2ad43c7981%26type%3D32%26m%3D1&ex-fch=416613&ex-src=https://www.amazon.com&ex-hargs=v%3D1.0%3Bc%3D6202100410201%3Bp%3D14E065AC-D355-628D-EE6F-3D2AD43C7981' + '&cb=' + a);
                _pix.setAttribute('id','_pix_id');
                document.body.appendChild(_pix);
            }

        }

        function trackingPixelsOffAmazon() {
            var _pix = document.getElementById('_pix_id_86bbbcae-97b7-c152-2ae6-515bdc16791f');
            if (!_pix) {
                var protocol = '//';
                var a = Math.random() * 1000000000000000000;
                _pix = document.createElement('img');
                _pix.style.display = 'none';
                _pix.setAttribute('src', protocol + 's.amazon-adsystem.com/iu3?d=forester-did&ex-fargs=%3Fid%3D86bbbcae-97b7-c152-2ae6-515bdc16791f%26type%3D6%26m%3D1&ex-fch=416613&ex-src=https://www.amazon.com&ex-hargs=v%3D1.0%3Bc%3D4627517910301%3Bp%3D86BBBCAE-97B7-C152-2AE6-515BDC16791F' + '&cb=' + a);
                _pix.setAttribute('id','_pix_id_86bbbcae-97b7-c152-2ae6-515bdc16791f');
                document.body.appendChild(_pix);
            }
        }
    }
);