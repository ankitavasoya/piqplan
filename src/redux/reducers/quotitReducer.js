import { SEARCHRX_DRUG, SEARCHRX_DRUG_LOADING, SEARCHRX_DRUG_ERROR, SEARCH_PCP, SEARCH_PCP_LOADING, SEARCH_PCP_ERROR, GET_ZIPCODE_ERROR, GET_ZIPCODE, SEARCH_PHARMACIES_LOADING, SEARCH_PHARMACIES, SEARCH_PHARMACIES_ERROR } from "../type"

const intialState = {
    loading: false,
    searchDrugData: null,
    searchDrugError: null,
    searchPcpData: null,
    searPcpError: null,
    zipCodeData: null,
    zipCodeError: null,
    searchPharmaciesData: null,
    searchPharmaciesError: null,
};

export const quotitReducer = (state = intialState, action) => {
    switch (action?.type) {
        case SEARCHRX_DRUG_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case SEARCHRX_DRUG:
            return {
                ...state,
                searchDrugData: action.payload,
            };
        case SEARCHRX_DRUG_ERROR:
            return {
                ...state,
                searchDrugError: action.payload,
            };

        case SEARCH_PCP_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case SEARCH_PCP:
            return {
                ...state,
                searchPcpData: action.payload,
            }
        case SEARCH_PCP_ERROR:
            return {
                ...state,
                searPcpError: action.payload,
            }

        case SEARCH_PHARMACIES_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case SEARCH_PHARMACIES:
            return {
                ...state,
                searchPharmaciesData: action.payload,
            }
        case SEARCH_PHARMACIES_ERROR:
            return {
                ...state,
                searchPharmaciesError: action.payload,
            }

        case GET_ZIPCODE:
            return {
                ...state,
                zipCodeData: action.payload,
            }
        case GET_ZIPCODE_ERROR:
            return {
                ...state,
                zipCodeError: action.payload,
            }

        default:
            return state;
    }
}
