/**
 * Admin Bar App component.
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
import { Fragment, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import AdminBarUniqueVisitors from './AdminBarUniqueVisitors';
import AdminBarSessions from './AdminBarSessions';
import AdminBarImpressions from './AdminBarImpressions';
import AdminBarClicks from './AdminBarClicks';
import LegacyAdminBarModules from './LegacyAdminBarModules';
import ActivateModuleCTA from '../ActivateModuleCTA';
import CompleteModuleActivationCTA from '../CompleteModuleActivationCTA';
import Data from 'googlesitekit-data';
import Link from '../Link';
import { CORE_SITE } from '../../googlesitekit/datastore/site/constants';
import { CORE_MODULES } from '../../googlesitekit/modules/datastore/constants';
import { decodeHTMLEntity, trackEvent } from '../../util';
import { useFeature } from '../../hooks/useFeature';
const { useSelect } = Data;

export default function AdminBarApp() {
	const widgetsAdminBarEnabled = useFeature( 'widgets.adminBar' );
	const currentEntityURL = useSelect( ( select ) => select( CORE_SITE ).getCurrentEntityURL() );
	const currentEntityTitle = useSelect( ( select ) => select( CORE_SITE ).getCurrentEntityTitle() );
	const detailsURL = useSelect( ( select ) => select( CORE_SITE ).getAdminURL( 'googlesitekit-dashboard', { permaLink: currentEntityURL } ) );
	const analyticsModuleConnected = useSelect( ( select ) => select( CORE_MODULES ).isModuleConnected( 'analytics' ) );
	const analyticsModuleActive = useSelect( ( select ) => select( CORE_MODULES ).isModuleActive( 'analytics' ) );

	const onMoreDetailsClick = useCallback( async () => {
		await trackEvent( 'admin_bar', 'post_details_click' );
		document.location.assign( detailsURL );
	}, [ detailsURL ] );

	if ( ! detailsURL || ! currentEntityURL ) {
		return null;
	}

	return (
		<Fragment>
			<div className="mdc-layout-grid">
				<div className="mdc-layout-grid__inner">
					<div className="
						mdc-layout-grid__cell
						mdc-layout-grid__cell--span-3
						mdc-layout-grid__cell--align-middle
					">
						<div className="googlesitekit-adminbar__subtitle">
							{ __( 'Stats for', 'google-site-kit' ) }
						</div>
						<div className="googlesitekit-adminbar__title">
							{ currentEntityTitle
								? decodeHTMLEntity( currentEntityTitle )
								: currentEntityURL
							}
						</div>
					</div>
					<div className="
						mdc-layout-grid__cell
						mdc-layout-grid__cell--span-8-tablet
						mdc-layout-grid__cell--span-7-desktop
						mdc-layout-grid__cell--align-middle
					">
						<div className="mdc-layout-grid__inner">
							{ widgetsAdminBarEnabled && (
								<Fragment>
									<AdminBarImpressions />
									<AdminBarClicks />

									{ analyticsModuleConnected && analyticsModuleActive && (
										<Fragment>
											<AdminBarUniqueVisitors />
											<AdminBarSessions />
										</Fragment>
									) }

									{ ( ! analyticsModuleConnected || ! analyticsModuleActive ) && (
										<div className="
											mdc-layout-grid__cell
											mdc-layout-grid__cell--span-6-desktop
											mdc-layout-grid__cell--span-4-tablet
										">
											{ ! analyticsModuleActive && (
												<ActivateModuleCTA moduleSlug="analytics" />
											) }

											{ ( analyticsModuleActive && ! analyticsModuleConnected ) && (
												<CompleteModuleActivationCTA moduleSlug="analytics" />
											) }
										</div>
									) }
								</Fragment>
							) }

							<LegacyAdminBarModules />
						</div>
					</div>
					<div className="
						mdc-layout-grid__cell
						mdc-layout-grid__cell--span-2
						mdc-layout-grid__cell--align-middle
					">
						<Link
							className="googlesitekit-adminbar__link"
							href="#"
							onClick={ onMoreDetailsClick }
						>
							{ __( 'More details', 'google-site-kit' ) }
						</Link>
					</div>
				</div>
			</div>
			<Link
				className="googlesitekit-adminbar__link googlesitekit-adminbar__link--mobile"
				href="#"
				onClick={ onMoreDetailsClick }
			>
				{ __( 'More details', 'google-site-kit' ) }
			</Link>
		</Fragment>
	);
}
