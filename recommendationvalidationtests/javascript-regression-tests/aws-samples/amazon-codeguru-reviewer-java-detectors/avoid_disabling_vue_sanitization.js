// {fact rule=avoid_disabling_vue_sanitization@v1.0 defects=1}

function avoid_disabling_vue_sanitization_non_compliant() {
    const Vue = require("vue");
    Vue.component('element', {
        render: function (createElement) {
            return createElement(
                'div',
                {
                    domProps: {
                        innerHTML: this.htmlContent, // innerHTML is unsafe.
                    }
                },
                "click here"
            );
        },
    });
}

// {/fact}

// {fact rule=avoid_disabling_vue_sanitization@v1.0 defects=0}

function avoid_disabling_vue_sanitization_compliant() {
    const Vue = require("vue");
    Vue.component('element', {
        render: function (createElement) {
            return createElement(
                'div',
                {
                    domProps: {
                        innerText: this.htmlContent, // innerText is safe.
                    }
                },
                "click here"
            );
        },
    });
}

// {/fact}