// {fact rule=non_literal_regular_expression_js_rule@v1.0 defects=1}

function nonCompliant1() {
    expression = ".*";
    const regularExpression = new RegExp(expression);
    return regularExpression.exec(expression);
}
// {/fact}

// {fact rule=non_literal_regular_expression_js_rule@v1.0 defects=0}

function compliant1() {
    const regularExpression = new RegExp();
    return regularExpression.exec(".*");
}
// {/fact}

