import { Spinner } from "reactstrap";

export const Loading = (style?: React.CSSProperties): React.JSX.Element => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={style}>
            <Spinner color="primary" />
        </div>
    );
}

export default Loading;