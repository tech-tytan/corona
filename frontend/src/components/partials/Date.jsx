function Date({ from, to }) {
    return (<>
        <input ref={from} type="text" className="form-control form-control-sm d-inline-block col-4" placeholder="From: YYYY-MM-DD" />
        <br />
        <input ref={to} type="text" className="form-control form-control-sm d-inline-block col-4" placeholder="To: YYYY-MM-DD" />
    </>)
}

export default Date
