import alt from '../alt'
import responseUtil from '../../components/utils/responseUtil';

class RelationActions {
  getPeople(){
    return function(dispatch) {
      return fetch(process.env.API_ROOT + 'api/people/getRelatedPeople', {
        method: 'POST', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({})
      })
      .then(response => response.json())
      .then(response => {
        dispatch(response);
        return response;
      })
      .catch(err => {
        let craftedResponse = responseUtil.craftErrorResponse(err);
        dispatch(craftedResponse);
        return craftedResponse;
      })
    }
  }

  makeDoctorPatientRelationship(doctor, patient) {
    return function(dispatch) {
      return fetch(process.env.API_ROOT + 'api/people/bindDoctorAndPatient', {
        method: 'POST',
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          doctor: doctor,
          patient: patient
        })
      })
      .then(response => response.json())
      .then(response => {
        dispatch(response);
        return response;
      })
      .catch(err => {
        let craftedResponse = responseUtil.craftErrorResponse(err);
        dispatch(craftedResponse);
        return craftedResponse;
      })
    }
  }

  makeCaregiverPatientRelationship(caregiver, patient) {
    return function(dispatch) {
      return fetch(process.env.API_ROOT + 'api/people/bindCaregiverAndPatient', {
        method: 'POST',
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          caregiver: caregiver,
          patient: patient
        })
      })
      .then(response => response.json())
      .then(response => {
        dispatch(response);
        return response;
      })
      .catch(err => {
        let craftedResponse = responseUtil.craftErrorResponse(err);
        dispatch(craftedResponse);
        return craftedResponse;
      })
    }
  }
}

export default alt.createActions(RelationActions);