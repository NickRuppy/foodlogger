/// <reference types="@types/google.maps" />

declare namespace google.maps.places {
  interface AutocompletePrediction {
    description: string;
    place_id: string;
    structured_formatting?: {
      main_text: string;
      secondary_text: string;
    };
  }

  interface PlaceResult {
    name?: string;
    formatted_address?: string;
    url?: string;
  }

  interface AutocompletionRequest {
    input: string;
    types?: string[];
  }

  interface PlaceDetailsRequest {
    placeId: string;
    fields?: string[];
  }

  class AutocompleteService {
    getPlacePredictions(
      request: AutocompletionRequest,
      callback: (
        predictions: AutocompletePrediction[] | null,
        status: PlacesServiceStatus
      ) => void
    ): void;
  }

  class PlacesService {
    constructor(attrContainer: HTMLElement);
    getDetails(
      request: PlaceDetailsRequest,
      callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
    ): void;
  }

  type PlacesServiceStatus = 'OK' | 'ZERO_RESULTS' | 'ERROR';
} 