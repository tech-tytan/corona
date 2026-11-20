import { useRef } from "react"
import CurrentPassword from "./CurrentPassword"

function ChangePassword({ data, setData, execute, showPassword }) {
    const password = useRef(null);
    const current_password = useRef(null);
    const id = "password";

    return (<div className="col-md-6 grid-margin stretch-card">
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Change Password</h4>
                <form ref={password} className="forms-sample" onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="new_password">New Password</label>
                        <input type="password" className="form-control" id="new_password" name="new_password" placeholder="New Password" />
                        <div className="text-danger">{(data?.errors?.new_password != undefined) ? data.errors.new_password[0] : ""}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm_new_password">Confirm New Password</label>
                        <input type="password" className="form-control" id="confirm_new_password" name="confirm_new_password" placeholder="Confirm New Password" />
                        <div className="text-danger">{(data?.errors?.confirm_new_password != undefined) ? data.errors.confirm_new_password[0] : ""}</div>
                    </div>
                    {(showPassword != "" && showPassword === id) ? <CurrentPassword current_password={current_password} error={data?.errors?.current_password} /> : ""}
                    <div className="form-group text-right">
                        <button type="submit" className="btn btn-primary mr-2" name="change" value="Change" onClick={e => {
                            execute(id, password, e, setData, current_password);
                        }}>Change</button>
                    </div>
                </form>
            </div>
        </div>
    </div>)
}

export default ChangePassword
