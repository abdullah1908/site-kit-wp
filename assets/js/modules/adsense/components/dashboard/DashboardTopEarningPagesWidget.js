/**
 * DashboardTopEarningPagesWidget component.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import Widgets from 'googlesitekit-widgets';
import { MODULES_ANALYTICS, DATE_RANGE_OFFSET } from '../../../analytics/datastore/constants';
import { CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import whenActive from '../../../../util/when-active';
import PreviewTable from '../../../../components/PreviewTable';
import { getDataTableFromData } from '../../../../components/data-table';
import SourceLink from '../../../../components/SourceLink';
import AdSenseLinkCTA from '../../../analytics/components/common/AdSenseLinkCTA';
import { isZeroReport } from '../../../analytics/util';
import ReportError from '../../../../components/ReportError';
import TableOverflowContainer from '../../../../components/TableOverflowContainer';
const { useSelect } = Data;
const { Widget } = Widgets.components;

function DashboardTopEarningPagesWidget( { WidgetReportZero } ) {
	const {
		isAdSenseLinked,
		analyticsMainURL,
		data,
		error,
		loading,
	} = useSelect( ( select ) => {
		const { startDate, endDate } = select( CORE_USER ).getDateRangeDates( {
			offsetDays: DATE_RANGE_OFFSET,
		} );
		const args = {
			startDate,
			endDate,
			dimensions: [ 'ga:pageTitle', 'ga:pagePath' ],
			metrics: [
				{ expression: 'ga:adsenseRevenue', alias: 'Earnings' },
				{ expression: 'ga:adsenseECPM', alias: 'Page RPM' },
				{ expression: 'ga:adsensePageImpressions', alias: 'Impressions' },
			],
			orderby: {
				fieldName: 'ga:adsenseRevenue',
				sortOrder: 'DESCENDING',
			},
			limit: 10,
		};

		return {
			isAdSenseLinked: select( MODULES_ANALYTICS ).getAdsenseLinked(),
			analyticsMainURL: select( MODULES_ANALYTICS ).getServiceURL(),
			data: select( MODULES_ANALYTICS ).getReport( args ),
			error: select( MODULES_ANALYTICS ).getErrorForSelector( 'getReport', [ args ] ),
			loading: ! select( MODULES_ANALYTICS ).hasFinishedResolution( 'getReport', [ args ] ),
		};
	} );

	if ( loading ) {
		return (
			<PreviewTable rows={ 5 } padding />
		);
	}

	// A restricted metrics error will cause this value to change in the resolver
	// so this check should happen before an error, which is only relevant if they are linked.
	if ( ! isAdSenseLinked ) {
		return <AdSenseLinkCTA />;
	}

	if ( error ) {
		return <ReportError moduleSlug="analytics" error={ error } />;
	}

	if ( isZeroReport( data ) ) {
		return <WidgetReportZero moduleSlug="analytics" />;
	}

	const headers = [
		{
			title: __( 'Top Earning Pages', 'google-site-kit' ),
			tooltip: __( 'Top Earning Pages', 'google-site-kit' ),
			primary: true,
		},
		{
			title: __( 'Revenue', 'google-site-kit' ),
			tooltip: __( 'Revenue', 'google-site-kit' ),
		},
	];

	const links = [];
	const dataMapped = data[ 0 ].data.rows.map( ( row, i ) => {
		links[ i ] = row.dimensions[ 1 ];
		return [
			row.dimensions[ 0 ],
			Number( row.metrics[ 0 ].values[ 0 ] ).toFixed( 2 ),
		];
	} );

	const options = {
		hideHeader: false,
		chartsEnabled: false,
		cap: 5,
		links,
	};

	const dataTable = getDataTableFromData( dataMapped, headers, options );

	return (
		<Widget
			slug="adsenseTopEarningPages"
			noPadding
			footer={ () => (
				<SourceLink
					className="googlesitekit-data-block__source"
					name={ _x( 'Analytics', 'Service name', 'google-site-kit' ) }
					href={ analyticsMainURL }
					external
				/>
			) }
		>
			<TableOverflowContainer>
				{ dataTable }
			</TableOverflowContainer>
		</Widget>
	);
}

export default compose(
	whenActive( { moduleName: 'adsense' } ),
	whenActive( { moduleName: 'analytics' } ),
)( DashboardTopEarningPagesWidget );
