import React, { useEffect, useState } from "react";

export function Hatching({ hegg, option, selectedAddress }) {
    let breakUp = async (option) => {
        await hegg.breakUp(option);
    }

    const [dueTime, setDueTime] = useState(new Date());
    const [isReady, setReady] = useState(false);
    useEffect(() => {
        async function update() {
            let t = await hegg.dueTime(selectedAddress);
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
