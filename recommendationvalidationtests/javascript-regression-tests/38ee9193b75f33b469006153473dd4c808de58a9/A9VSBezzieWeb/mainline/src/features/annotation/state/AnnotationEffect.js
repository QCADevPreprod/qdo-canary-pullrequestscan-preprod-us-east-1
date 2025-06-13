import axios from 'axios';

import {
    api_annotation
} from '../../../gconsts';


//   -------------------------------------------------------------------------------------------------------------

export async function createAnnotationEffect(form_data) {

    let annotations_response = axios.get(api_annotation, { params: form_data } )
    .then((response) => {
        const data = 'input('+response.data+')';
        var xml = "<book><title>Harry Potter</title></book>"
        var doc = new dom().parseFromString(xml)
        var nodes = xpath.select("//title" + data, doc)
    })
    .then((response) => {

        let upload_request = {
            batch_id: response["batch_id"],
            username: form_data["username"],
            upload_url: response['upload_url'],
            evaluation_uid: form_data["evaluation_uid"]
        }

        return axios.post(api_annotation, upload_request)

    }).then((response) => response)

    return annotations_response

};

//   -------------------------------------------------------------------------------------------------------------

export async function fetchAnnotationBatchInfoEffect(params) {

    let api_annotation = 'https://api.ssmetrics.truth.a9.amazon.dev/batches'

    let annotations_response =  await axios.get(api_annotation, { params: params, withCredentials: true } )
                .then((resp) => {return resp})

    return annotations_response;

};

//   -------------------------------------------------------------------------------------------------------------

export async function fetchAnnotationInspiringRatePerBatchEffect(batch_id) {

    // batch_id = 'f568928b-8681-4db6-8a98-043249987f32'
    let api_annotation = 'https://api.ssmetrics.truth.a9.amazon.dev/metrics/inspiring_rate/batches/' + batch_id

    let annotations_response =  await axios.get(api_annotation, { withCredentials: true } )
                .then((resp) => {return resp})

    return annotations_response;

};

export async function fetchAnnotationInspiringRatePerCategoryEffect(batch_id) {

    // batch_id = 'f568928b-8681-4db6-8a98-043249987f32'
    let api_annotation = 'https://api.ssmetrics.truth.a9.amazon.dev/metrics/inspiring_rate/batches/' + batch_id + '?category=all'

    let annotations_response =  await axios.get(api_annotation, { withCredentials: true } )
                .then((resp) => {return resp})

    return annotations_response;

};

//   -------------------------------------------------------------------------------------------------------------
