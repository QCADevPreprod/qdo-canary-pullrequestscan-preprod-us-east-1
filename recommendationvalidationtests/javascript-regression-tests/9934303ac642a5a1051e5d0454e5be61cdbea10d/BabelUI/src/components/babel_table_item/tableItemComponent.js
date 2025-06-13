const Vue = require("vue");
import {ColumnType} from "@/components/babel_table_item/babelTableColumnType";
import babelTableItemGraphicPreview from "@/components/babel_table_item/babelTableItemGraphicPreview";

export function validKey(obj, key) {

    Vue.component(ColumnType.graphicPreview, babelTableItemGraphicPreview);

    Vue.component(ColumnType.check, {
        render: function (createElement) {
            const self = this;
            return createElement(
                'div',
                {
                    class: ['babel-table-check'],
                },
                [createElement(
                    'input',
                    {
                        attrs : {
                            'type': 'checkbox',
                            'name': 'check',
                        },
                        domProps: {
                            checked: this.obj[this.keys[0]],
                        },
                        on: {
                            click: function (event) {
                                self.helper['checkboxHandle'](event, self.row);
                            }
                        }
                    },
                )]
            )
        },
        props: ['keys', 'obj', 'helper', 'row'],
    });

    Vue.component(ColumnType.plainText, {
        render: function (createElement) {
            if (!validKey(this.obj, this.keys[0])) {
                return null;
            }
            return createElement(
                'span',
                [this.obj[this.keys[0]]]
            )
        },
        props: ['keys', 'obj'],
    });

    Vue.component(ColumnType.link, {
        render: function (createElement) {
            if (!validKey(this.obj, this.keys[0]) || !validKey(this.obj, this.keys[1])) {
                return null;
            }
            return createElement(
                'a',
                {
                    attrs: {
                        target: '_blank',
                        href: this.constructLink(this.obj[this.keys[1]]),
                    },
                },
                [this.obj[this.keys[0]]],
            )
        },
        methods: {
            constructLink: function (link) {
                if (link.startsWith('http://') || link.startsWith('https://'))
                    return link;
                else
                    return 'https://' + link;
            }
        },
        props: ['keys', 'obj'],
    });

    Vue.component(ColumnType.status, {
        render: function (createElement) {
            if (!validKey(this.obj, this.keys[0])) {
                return null;
            }
            let com = this;
            return createElement(
                'div',
                [
                    createElement('div',
                        {
                            class: ['statusClass'],
                            style: [com['helper']['getColorClass'](com.status)],
                        },
                        [com.status]
                    )
                ],
            )
        },
        computed: {
            status: function () {
                return this.obj[this.keys[0]];
            }
        },
        props: ['keys', 'obj', 'helper'],
    });

    Vue.component(ColumnType.weblab, {
        render: function (createElement) {
            if (!validKey(this.obj, this.keys[0]) || !validKey(this.obj[this.keys[0]], 'weblabName')) {
                return createElement('span', ['None']);
            }
            const weblab = this.obj[this.keys[0]]
            if (validKey(weblab, 'weblabLink')) {
                return createElement(
                    'a',
                    {
                        attrs: {
                            target: '_blank',
                            href: weblab.weblabLink,
                        },
                    },
                    weblab.weblabName,
                )
            } else {
                return createElement('span', [weblab.weblabName]);
            }
        },
        props: ['keys', 'obj'],
    });


    Vue.component(ColumnType.bullsEye, {
        render: function (createElement) {
            let com = this;
            if (!(validKey(this.obj, this.keys[0]))) {
                return createElement('span', ['All Customers']);
            } else if (validKey(this.obj, this.keys[1])) {
                return createElement(
                    'div',
                    [createElement('span', 'All Customers '),
                        createElement('a', {
                            attrs: {
                                target: '_blank',
                                href: com.obj[com.keys[1]],
                            },
                        }, [com.obj[com.keys[0]]])
                    ],
                )
            } else {
                return createElement('span', ['All Customers Multiple']);
            }
        },
        props: ['keys', 'obj'],
    });

    Vue.component(ColumnType.translationItem, {
        render: function (createElement) {
            if (this.item && validKey(this.item, this.keys[1])) {
                let com = this;
                return createElement('div', [
                    createElement('p', {
                        style: com['helper']['innerClass']['first']
                    }, [com.item[com.keys[1]]]),
                    createElement('p', {
                        style: com['helper']['innerClass']['second']
                    }, [validKey(this.item, this.keys[2]) ? com.item[com.keys[2]] : 'unknown']),
                ])
            } else {
                return undefined;
            }
        },
        computed: {
            item: function () {
                return this.obj[this.keys[0]][0];
            },
        },
        props: ['keys', 'obj', 'helper'],
    });

    Vue.component(ColumnType.graphicType, {
        render: function (createElement) {
            if (!validKey(this.obj, this.keys[0])) {
                return null;
            }
            return createElement(
                'span',
                [this.getGraphicTypes(this.obj[this.keys[0]])]
            )
        },
        computed: {
            getGraphicTypes: function () {
                return (typeId) => {
                    if (this.helper['graphicTypes'].size === 0)
                        return ''
                    if (this.helper['graphicTypes'].get(typeId) === undefined) {
                        return 'wrong graphic type id';
                    }
                    return this.helper['graphicTypes'].get(typeId).name;
                }
            },
        },
        props: ['keys', 'obj', 'helper'],
    });

    Vue.component(ColumnType.graphicIcons, {
        render: function (createElement) {
            return createElement(
                'div',
                {
                    style: {'display': 'flex', 'flex-direction': 'row', 'gap': '10px'}
                },
                this.sourceImages.map((url, index) => {
                    return createElement(
                        'img',
                        {
                            key: index,
                            attrs: {
                                src: url,
                                width: '40px',
                                height: '40px'
                            },
                        }
                    )
                })
            )
        },
        computed: {
            sourceImages: function () {
                if (validKey(this.obj, this.keys[0])) {
                    return this.obj[this.keys[0]];
                }
                return [];
            }
        },
        props: ['keys', 'obj'],
    });

    return !(obj === undefined || obj === null || key === undefined || obj[key] === undefined);

}
