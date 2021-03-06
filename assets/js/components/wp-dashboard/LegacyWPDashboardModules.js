/**
 * LegacyWPDashboardModules component.
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
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getModulesData } from '../../util';
import ActivateModuleCTA from '../ActivateModuleCTA';
import LegacyWPDashboardModule from './LegacyWPDashboardModule';
import LegacyWPDashboardHeader from './LegacyWPDashboardHeader';

class LegacyWPDashboardModules extends Component {
	render() {
		const modulesData = getModulesData();

		return (
			<Fragment>
				<div className={ classnames(
					'googlesitekit-wp-dashboard-stats',
					{ 'googlesitekit-wp-dashboard-stats--fourup': modulesData.analytics.active }
				) }>
					<LegacyWPDashboardHeader
						key={ 'googlesitekit-wp-dashboard-header' }
					/>
					{ // Show the Analytics CTA if analytics is not enabled.
						( ! modulesData.analytics.active ) &&
						<div className="googlesitekit-wp-dashboard-stats__cta">
							<ActivateModuleCTA moduleSlug="analytics" />
						</div>
					}
				</div>
				<LegacyWPDashboardModule
					key={ 'googlesitekit-wp-dashboard-module' }
				/>
			</Fragment>
		);
	}
}

export default LegacyWPDashboardModules;
