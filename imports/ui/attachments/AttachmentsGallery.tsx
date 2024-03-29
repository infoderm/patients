import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import dateFormat from 'date-fns/format';

import {map} from '@iterable-iterator/map';
import {list} from '@iterable-iterator/list';
import {groupby} from '@iterable-iterator/group';

import Loading from '../navigation/Loading';

import makeStyles from '../styles/makeStyles';

import useAttachments from './useAttachments';
import type AttachmentInfo from './AttachmentInfo';
import AttachmentsGrid from './AttachmentsGrid';

const useStyles = makeStyles()((theme) => ({
	group: {
		padding: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
}));

type StaticAttachmentsGalleryProps = {
	readonly loading: boolean;
	readonly attachmentsInfo: Map<string, AttachmentInfo>;
	readonly attachments: Array<{_id: string}>;
};

const StaticAttachmentsGallery = ({
	loading,
	attachmentsInfo,
	attachments,
}: StaticAttachmentsGalleryProps) => {
	const {classes} = useStyles();

	if (loading) {
		return <Loading />;
	}

	const grp = (x: {_id: string}) => attachmentsInfo.get(x._id)!.group;

	const groups = list(
		map(
			([k, g]) => [k, list(g)],
			groupby(
				grp,
				attachments.sort((a, b) => grp(b) - grp(a)), // We are abusing stable native sorting here.
			),
		),
	);

	console.debug({
		attachments: attachments.map((attachment) => ({
			attachment,
			info: attachmentsInfo.get(attachment._id),
		})),
	});

	return (
		<Grid container>
			{list(
				map(
					([k, g]) => (
						<Grid key={k} item container spacing={2} className={classes.group}>
							<Grid item lg={12}>
								<Typography variant="h3">
									{k === Number.POSITIVE_INFINITY
										? 'Pièces jointes au patient'
										: `Consultation du ${dateFormat(
												new Date(k),
												'yyyy-MM-dd',
										  )}`}
								</Typography>
							</Grid>
							<AttachmentsGrid
								item
								spacing={2}
								attachments={g}
								attachmentsInfo={attachmentsInfo}
							/>
						</Grid>
					),
					groups,
				),
			)}
		</Grid>
	);
};

type ReactiveAttachmentsGalleryProps = {
	readonly attachmentsInfo: AttachmentInfo[];
};

const ReactiveAttachmentsGallery = ({
	attachmentsInfo,
}: ReactiveAttachmentsGalleryProps) => {
	const attachmentsId = attachmentsInfo.map((x) => x.attachmentId);
	const query = {
		filter: {_id: {$in: attachmentsId}},
		sort: {'meta.createdAt': -1} as const,
	};
	const deps = [JSON.stringify(query)];
	const {loading, results: attachments} = useAttachments(query, deps);

	const attachmentsInfoMap = new Map(
		attachmentsInfo.map((x) => [x.attachmentId, x]),
	);

	const filteredAttachments = attachments.filter((attachment) =>
		attachmentsInfoMap.has(attachment._id),
	);

	return (
		<StaticAttachmentsGallery
			loading={loading}
			attachmentsInfo={attachmentsInfoMap}
			attachments={filteredAttachments}
		/>
	);
};

export default ReactiveAttachmentsGallery;
