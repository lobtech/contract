import React, { useEffect, useState } from "react";

export function Incubator({ startHatching, option, getUri }) {
    let [uri, setUri] = useState('');
    useEffect(() => {
        async function update() {
            let path = await getUri(option);
            setUri(path);
        }
        update();
    }, [option])

    return (
        <>
            <div>Egg Option: {option}</div>
            <div>Egg path: {uri}</div>
            <button onClick={() => startHatching(option)}>Start hatching</button>
        </>
    )
}
