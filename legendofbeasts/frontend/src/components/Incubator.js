import React from "react";

export function Incubator({ startHatching, option }) {
    return (
        <>
            <div>{option}</div>
            <button onClick={() => startHatching(option)}>Start hatching</button>
        </>
    )
}
