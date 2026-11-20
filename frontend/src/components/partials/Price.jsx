function Price({ min_price, max_price }) {
    return (<>
        <input ref={min_price} type="text" className="form-control form-control-sm d-inline-block col-4" placeholder="Min. Price" />
        <br />
        <input ref={max_price} type="text" className="form-control form-control-sm d-inline-block col-4" placeholder="Max. Price" />
    </>)
}

export default Price
