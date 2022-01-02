import React from "react";

export function Faucet({ transferTokens, tokenSymbol, selectedAddress }) {
    return (
        <div>
            <h4>Faucet</h4>
            <form
                onSubmit={(event) => {
                    // This function just calls the transferTokens callback with the
                    // form's data.
                    event.preventDefault();

                    transferTokens(selectedAddress);
                }}
            >
                <div className="form-group">
                    <label>Get a random Egg</label>
                </div>
                <div className="form-group">
                    <input className="btn btn-primary" type="submit" value="Submit" />
                </div>
            </form>
        </div>
    );
}
