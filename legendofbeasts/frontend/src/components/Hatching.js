import React from "react";

export function Hatching({ breakUp, option, isReady, timeReady }) {
    return (
        <>
            <div>Egg Option: {option}</div>
            <div>Ready: {isReady.toString()}</div>
            <div>Due: {timeReady.toString()}</div>
            <button onClick={() => breakUp(option)} disabled={!isReady}>Break Up</button>
        </>
    )
}
