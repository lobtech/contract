import React, { useEffect, useState } from "react";

export function Dragon({ getDragonId }) {
    const [tokenId, setTokenId] = useState(-1);
    useEffect(() => {
        async function update() {
            let id = await getDragonId();
            setTokenId(id);
        }
        update();
    });
    return (
        <div>
            <h4>Congratz! You've got a mighty Dragon</h4>
            <div>Dragon ID: {tokenId}</div>
        </div>
    )
}