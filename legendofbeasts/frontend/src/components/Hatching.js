import React from "react";

export function Hatching({ breakUp, option, isReady }) {
    return (
        <>
            <div>{option}</div>
            <div>{isReady ? "Ready" : "Hatching"}</div>
            <button onClick={() => breakUp(option)} disabled={isReady}>Break Up</button>
        </>
    )
}
