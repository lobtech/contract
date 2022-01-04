import React, { useEffect, useState } from "react";

export function Hatching({ breakUp, option, timeReady }) {
    const [dueTime, setDueTime] = useState(new Date());
    const [isReady, setReady] = useState(false);
    useEffect(() => {
        async function update() {
            let t = await timeReady();
            let readyTime = new Date(t.toNumber() * 1000);
            setDueTime(readyTime);
            setReady(readyTime < new Date());
        }
        update();
    }, []);
    return (
        <>
            <div>Egg Option: {option}</div>
            <div>Ready: {isReady.toString()}</div>
            <div>Due: {dueTime && dueTime.toString()}</div>
            <button onClick={() => breakUp(option)} disabled={!isReady}>Break Up</button>
        </>
    )
}
