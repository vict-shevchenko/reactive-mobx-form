import * as React from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
	return (
		<div>
			<Link className="nav-item" to="/">Read me</Link>
			<Link className="nav-item" to="/examples/simple/SimpleForm">Simple Form</Link>
			<Link className="nav-item" to="/examples/sync-validation/SyncFieldValidation">Sync Field Validation</Link>
			<Link className="nav-item" to="/examples/control-section/ControlSection">ControlSection</Link>
			<Link className="nav-item" to="/examples/control-array/ControlArray">ControlArray</Link>
		</div>
	)
}