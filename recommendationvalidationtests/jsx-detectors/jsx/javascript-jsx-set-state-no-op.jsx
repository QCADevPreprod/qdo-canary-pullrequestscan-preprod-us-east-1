import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    const incrementCount = () => {
        // Functional update form
        // ok: javascript-jsx-set-state-no-op
        setCount(prevCount => prevCount + 1);
    };

    const decrementCount = () => {
        // Functional update form
        setCount(prevCount => prevCount - 1);
    };

    const resetCount = () => {
        // Functional update form
        setCount(() => 0);
    };

    return (
        <div>
            <h1>{count}</h1>
            <button onClick={incrementCount}>Increment</button>
            <button onClick={decrementCount}>Decrement</button>
            <button onClick={resetCount}>Reset</button>
        </div>
    );
}

const PolicyColumn = ({
                          group,
                          deck,
                      }) => {
    const [actionsExpanded, setActionsExpanded] = useState<boolean>(false);
    return (
        <ColumnContainer>
            <ColumnHeader>
                <Button
                    small
                    minimal

                    onClick={() => {
                        // ruleid: javascript-jsx-set-state-no-op
                        setActionsExpanded(actionsExpanded);
                    }}
                    intent={actionsExpanded ? Intent.PRIMARY : Intent.NONE}>
                    <FontAwesomeIcon icon={faBell} />
                </Button>
            </ColumnHeader>
        </ColumnContainer>

    );
};

export default PolicyColumn;
