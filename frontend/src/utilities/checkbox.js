export function selectUnselect(obj, listings) {
    const su = obj.target.checked;
    const cbs = listings.current.querySelectorAll("input[type='checkbox']");
    for (let cb of cbs) {
        cb.checked = su;
    }
}

export function select(su, listings) {
    const all = listings.current.querySelectorAll("input[type='checkbox']").length;
    const checked = listings.current.querySelectorAll("input[type='checkbox']:checked").length;
    if (all === checked) {
        su.current.checked = true;
    }
    else {
        su.current.checked = false;
    }
}
