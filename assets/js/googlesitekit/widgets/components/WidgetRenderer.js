/**
 * WidgetRenderer component.
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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { Fragment, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME } from '../datastore/constants';
import Widget from './Widget';
import { getWidgetComponentProps } from '../util';
import { HIDDEN_CLASS } from '../util/constants';

const { useSelect } = Data;

const WidgetRenderer = ( { slug, gridClassName, OverrideComponent } ) => {
	const widget = useSelect( ( select ) => select( STORE_NAME ).getWidget( slug ) );

	const widgetComponentProps = useMemo( () => getWidgetComponentProps( slug ), [ slug ] );

	if ( ! widget ) {
		return null;
	}

	const { Component, wrapWidget } = widget;

	let widgetElement = <Component { ...widgetComponentProps } />;

	if ( OverrideComponent ) {
		// If OverrideComponent passed, render it instead of the actual widget.
		// It always needs to be wrapped as it is expected to be a
		// widget-agnostic component.
		// The real widget component will still be rendered, but it will be
		// hidden via CSS.
		widgetElement = (
			<Fragment>
				<Widget slug="overridden">
					<OverrideComponent />
				</Widget>
				<div className={ HIDDEN_CLASS }>
					{ widgetElement }
				</div>
			</Fragment>
		);
	} else if ( wrapWidget ) {
		// Otherwise, wrap the component only if that is requested for this
		// widget.
		widgetElement = <Widget slug={ slug }>{ widgetElement }</Widget>;
	}

	// Wrap the widget into a grid class.
	if ( gridClassName ) {
		return (
			<div className={ gridClassName }>
				{ widgetElement }
			</div>
		);
	}

	return widgetElement;
};

WidgetRenderer.propTypes = {
	slug: PropTypes.string.isRequired,
	gridClassName: PropTypes.string,
	OverrideComponent: PropTypes.elementType,
};

export default WidgetRenderer;
