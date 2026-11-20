function CurrentPassword({ current_password, error }) {
    return (<div className="form-group">
        <label htmlFor="current_password">Current Password</label>
        <input ref={current_password} type="password" className="form-control" id="current_password" name="current_password" placeholder="Current Password" />
        <div className="text-danger">{(error != undefined) ? error[0] : ""}</div>
    </div>)
}

export default CurrentPassword
