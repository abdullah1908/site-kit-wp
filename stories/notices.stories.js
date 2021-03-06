/**
 * Notices Stories.
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
import { storiesOf } from '@storybook/react';

/**
 * Internal dependencies
 */
import SettingsNotice, { TYPE_WARNING, TYPE_INFO, TYPE_SUGGESTION } from '../assets/js/components/SettingsNotice';

storiesOf( 'Global/Notices', module )
	.add( 'Settings warning notice', () => (
		<SettingsNotice type={ TYPE_WARNING }>
			{ 'This is a warning.' }
		</SettingsNotice>
	) )
	.add( 'Settings info notice', () => (
		<SettingsNotice type={ TYPE_INFO }>
			{ 'This is an information.' }
		</SettingsNotice>
	) )
	.add( 'Settings suggestion notice', () => (
		<SettingsNotice type={ TYPE_SUGGESTION }>
			{ 'This is a suggestion.' }
		</SettingsNotice>
	) );
