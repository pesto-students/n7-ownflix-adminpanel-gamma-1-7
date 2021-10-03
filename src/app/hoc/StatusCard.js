import React from 'react';

export default function StatusCard(props) {
	const { title, count, col } = props;
	return (
		<div className={col}>
			<div className="status-card">
				<h2>{count}</h2>
				<h3>{title}</h3>
			</div>
		</div>
	);
}
