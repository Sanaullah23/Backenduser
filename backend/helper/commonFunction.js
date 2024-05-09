

const extract_object_keys = (data) => {
    if(data){
        return Object.keys(data)
    }
    else {
        return []
    }
 }
const extract_object_values = (data) => {
    return Object.values(data)
 }
 


const check_missing_fields = (required_fields, req_body, required_field_type) => {

    const body_keys = extract_object_keys(req_body)
    const missing_fields = []

    let required_fields_data_array = required_fields

    if(required_field_type){
        required_fields_data_array = extract_object_keys(required_fields)
    }

    required_fields_data_array.forEach(element => {
        const field_val = req_body[element]
        if (!body_keys.includes(element) || field_val === undefined || field_val === '') {
            missing_fields.push(element)
        }

    })
    return missing_fields
}

module.exports = {check_missing_fields}