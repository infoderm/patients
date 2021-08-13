import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

import {computeFixedFabStyle} from '../button/FixedFab';

import useDocuments from './useDocuments';
import StaticDocumentList from './StaticDocumentList';
import HealthOneDocumentImportButton from './HealthOneDocumentImportButton';

const styles = (theme) => ({
	importButton: computeFixedFabStyle({theme, col: 4}),
});

const useStyles = makeStyles(styles);

const DocumentsList = ({match, page, perpage}) => {
	page =
		(match?.params.page && Number.parseInt(match.params.page, 10)) ||
		page ||
		DocumentsList.defaultProps.page;
	perpage = perpage || DocumentsList.defaultProps.perpage;

	const options = {
		sort: {createdAt: -1},
		fields: StaticDocumentList.projection,
		skip: (page - 1) * perpage,
		limit: perpage,
	};

	const deps = [page, perpage];

	const {loading, results: documents} = useDocuments({}, options, deps);

	const classes = useStyles();

	return (
		<>
			<StaticDocumentList
				root="/documents"
				page={page}
				perpage={perpage}
				loading={loading}
				documents={documents}
			/>
			<HealthOneDocumentImportButton
				Button={Fab}
				className={classes.importButton}
				color="default"
			/>
		</>
	);
};

DocumentsList.defaultProps = {
	page: 1,
	perpage: 10,
};

DocumentsList.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number,
};

export default DocumentsList;
