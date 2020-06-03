
/**
 * Internal dependencies
 */
import createDataLayerPush from './createDataLayerPush';

/**
 * Returns a function which, when invoked tracks a single event.
 *
 * @param {Object} config Tracking configuration.
 * @param {Object} dataLayerTarget Data layer parent object.
 * @return {Function} Function that tracks an event.
 */
export default function createTrackEvent( config, dataLayerTarget ) {
	const dataLayerPush = createDataLayerPush( dataLayerTarget );

	/**
	 * Send an Analytics tracking event.
	 *
	 * @param {string} eventCategory The event category. Required.
	 * @param {string} eventName The event category. Required.
	 * @param {string} eventLabel The event category. Optional.
	 * @param {string} eventValue The event category. Optional.
	 * @return {Promise} Promise that always resolves.
	 */
	return function trackEvent( eventCategory, eventName, eventLabel = '', eventValue = '' ) {
		const {
			isFirstAdmin,
			referenceSiteURL,
			trackingEnabled,
			trackingID,
			userIDHash,
		} = config;

		if ( ! trackingEnabled ) {
			// Resolve immediately if tracking is disabled.
			return Promise.resolve();
		}

		return new Promise( ( resolve ) => {
			const eventData = {
				send_to: trackingID,
				event_category: eventCategory,
				event_label: eventLabel,
				event_value: eventValue,
				dimension1: referenceSiteURL,
				dimension2: isFirstAdmin ? 'true' : 'false',
				dimension3: userIDHash,
			};

			let resolved = false;
			const resolveOnce = ( eventSent ) => {
				if ( resolved ) {
					return;
				}
				resolved = true;
				if ( ! eventSent ) {
					global.console.warn( `Tracking event "${ eventName }" (category "${ eventCategory }") took too long to fire.` );
				}
				resolve();
			};

			// This timeout ensures a tracking event does not block the user
			// event if it is not sent (in time).
			// If this fails, it shouldn't reject the promise since event
			// tracking should not result in user-facing errors. It will just
			// trigger a console warning.
			const failTimeout = setTimeout( () => {
				resolveOnce( false );
			}, 1000 );

			dataLayerPush( 'event', eventName, {
				...eventData,
				event_callback: () => {
					clearTimeout( failTimeout );
					resolveOnce( true );
				},
			} );
		} );
	};
}
