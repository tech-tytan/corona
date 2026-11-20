function Status({ status }) {
    return (<select ref={status} className="form-control form-control-sm d-inline-block col-4">
        <option value="">Status</option>
        <option value="enabled">Enabled</option>
        <option value="disabled">Disabled</option>
    </select>)
}

export default Status
