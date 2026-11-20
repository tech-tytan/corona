import { useEffect } from "react"
import { useLocation, Outlet } from "react-router"

function Initialize() {
    const location = useLocation();

    useEffect(() => {
        if (window.$ || window.jQuery) {
            window.$(document).off('click.bs.dropdown.data-api');
        }
        window.$('[data-toggle="dropdown"]').dropdown();
        const scripts = [
            '/assets/js/misc.js',
            '/assets/js/off-canvas.js'
        ];
        const elements = scripts.map((item, index) => {
            const script = document.createElement("script");
            script.src = item;
            document.body.appendChild(script);
            return script;
        });
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });
        return () => {
            if (window.$ || window.jQuery) {
                window.$(document).off('click.bs.dropdown.data-api');
            }
            elements.forEach((item) => {
                document.body.removeChild(item);
            });
        }
    }, [location]);

    return <Outlet />
}

export default Initialize
