/**
 * DashboardPopularKeywordsWidget component.
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
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import Widgets from 'googlesitekit-widgets';
import { DATE_RANGE_OFFSET, STORE_NAME } from '../../datastore/constants';
import { CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import { CORE_USER } from '../../../../googlesitekit/datastore/user/constants';
import { numFmt, untrailingslashit } from '../../../../util';
import { getDataTableFromData } from '../../../../components/data-table';
import whenActive from '../../../../util/when-active';
import PreviewTable from '../../../../components/PreviewTable';
import SourceLink from '../../../../components/SourceLink';
import ReportError from '../../../../components/ReportError';
import ReportZero from '../../../../components/ReportZero';
import { isZeroReport } from '../../util';
import TableOverflowContainer from '../../../../components/TableOverflowContainer';
import { generateDateRangeArgs } from '../../util/report-date-range-args';
const { useSelect } = Data;
const { Widget } = Widgets.components;

function DashboardPopularKeywordsWidget() {
	const {
		data,
		error,
		loading,
		baseServiceURL,
	} = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		const domain = store.getPropertyID();

		const { startDate, endDate } = select( CORE_USER ).getDateRangeDates( { offsetDays: DATE_RANGE_OFFSET } );
		const args = {
			startDate,
			endDate,
			dimensions: 'query',
			limit: 10,
		};

		const baseServiceURLArgs = {
			resource_id: domain,
			...generateDateRangeArgs( { startDate, endDate } ),
		};

		const url = select( CORE_SITE ).getCurrentEntityURL();
		const isDomainProperty = select( STORE_NAME ).isDomainProperty();
		const referenceSiteURL = untrailingslashit( select( CORE_SITE ).getReferenceSiteURL() );
		if ( url ) {
			args.url = url;
			baseServiceURLArgs.page = `!${ url }`;
		} else if ( isDomainProperty && referenceSiteURL ) {
			baseServiceURLArgs.page = `*${ referenceSiteURL }`;
		}

		return {
			data: store.getReport( args ),
			error: store.getErrorForSelector( 'getReport', [ args ] ),
			loading: ! store.hasFinishedResolution( 'getReport', [ args ] ),
			baseServiceURL: store.getServiceURL( {
				path: '/performance/search-analytics',
				query: baseServiceURLArgs,
			} ),
		};
	} );

	if ( loading ) {
		return <PreviewTable padding />;
	}
	if ( error ) {
		return <ReportError moduleSlug="search-console" error={ error } />;
	}

	if ( isZeroReport( data ) ) {
		return <ReportZero moduleSlug="search-console" />;
	}

	const headers = [
		{
			title: __( 'Keyword', 'google-site-kit' ),
			tooltip: __( 'Most searched for keywords related to your content', 'google-site-kit' ),
			primary: true,
		},
		{
			title: __( 'Clicks', 'google-site-kit' ),
			tooltip: __( 'Number of times users clicked on your content in search results', 'google-site-kit' ),
		},
		{
			title: __( 'Impressions', 'google-site-kit' ),
			tooltip: __( 'Counted each time your content appears in search results', 'google-site-kit' ),
		},
	];

	const links = [];
	const dataMapped = data.map( ( row, i ) => {
		const query = row.keys[ 0 ];
		links[ i ] = addQueryArgs( baseServiceURL, { query: `!${ query }` } );
		return [
			query,
			numFmt( row.clicks, { style: 'decimal' } ),
			numFmt( row.impressions, { style: 'decimal' } ),
		];
	} );

	const options = {
		hideHeader: false,
		chartsEnabled: false,
		links,
	};

	const dataTable = getDataTableFromData( dataMapped, headers, options );

	return (
		<Widget
			slug="searchConsolePopularKeywords"
			noPadding
			footer={ () => (
				<SourceLink
					className="googlesitekit-data-block__source"
					name={ _x( 'Search Console', 'Service name', 'google-site-kit' ) }
					href={ baseServiceURL }
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

export default whenActive( { moduleName: 'search-console' } )( DashboardPopularKeywordsWidget );
