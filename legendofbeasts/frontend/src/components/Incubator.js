import React from "react";

export function Incubator({ startHatching, option }) {
    return (
        <>
            <div>Egg Option: {option}</div>
            <button onClick={() => startHatching(option)}>Start hatching</button>
        </>
    )
}
