import { useRef } from "react"
import CurrentPassword from "./CurrentPassword"

function UpdateProfile({ refs: { fname, lname, email, phone }, data, setValues, execute, showPassword }) {
    const update = useRef(null);
    const current_password = useRef(null);
    const id = "profile";

    return (<div className="col-md-6 grid-margin stretch-card">
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">Update Profile</h4>
                <form ref={update} className="forms-sample" onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input ref={fname} type="text" className="form-control" id="first_name" name="first_name" placeholder="First Name" />
                        <div className="text-danger">{(data?.errors?.first_name != undefined) ? data.errors.first_name[0] : ""}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Last Name</label>
                        <input ref={lname} type="text" className="form-control" id="last_name" name="last_name" placeholder="Last Name" />
                        <div className="text-danger">{(data?.errors?.last_name != undefined) ? data.errors.last_name[0] : ""}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input ref={email} type="email" className="form-control" id="email" name="email" placeholder="Email Address" />
                        <div className="text-danger">{(data?.errors?.email != undefined) ? data.errors.email[0] : ""}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input ref={phone} type="text" className="form-control" id="phone" name="phone" placeholder="Phone Number" />
                        <div className="text-danger">{(data?.errors?.phone != undefined) ? data.errors.phone[0] : ""}</div>
                    </div>
                    {(showPassword != "" && showPassword === id) ? <CurrentPassword current_password={current_password} error={data?.errors?.current_password} /> : ""}
                    <div className="form-group text-right">
                        <button type="submit" className="btn btn-primary mr-2" name="update" value="Update" onClick={e => {
                            execute(id, update, e, setValues, current_password);
                        }}>Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>)
}

export default UpdateProfile
