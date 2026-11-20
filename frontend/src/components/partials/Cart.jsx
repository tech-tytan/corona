import { useEffect, useRef } from "react"
import { money_format } from "../../utilities/currency"

function Cart({ data }) {
    const values = useRef([]);

    useEffect(() => {
        values.current = [];
    }, [data]);

    return (<>

        {/* Modal */}
        <div className="modal fade" id="suspendedCart" tabIndex="-1" aria-labelledby="suspendedCartLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="suspendedCartLabel">Cart</h5>
                        <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {(data?.items != undefined && data.items.length > 0) ? data.items.map((item, index) => {
                            const cart = data.cart_data[index];
                            if (cart.index === item.index) {
                                values.current[index] = (Number(item.amount) * Number(cart.quantity));
                            }
                            return <div key={item.index} className="border-bottom p-2"><span className="text-muted">Name:</span> {item.product} <span className="text-muted">Price:</span> NGN {money_format(item.amount)} <span className="text-muted">Quantity:</span> {cart.quantity}</div>
                        }) : ""}
                    </div>
                    {(values.current.length > 0) ? <div className="ml-2 mt-2"><span className="text-muted">Cart Total:</span> NGN {money_format(values.current.reduce((acc, cur) => acc + cur))}</div> : ""}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Cart
