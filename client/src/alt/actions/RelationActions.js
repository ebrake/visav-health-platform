import alt from '../alt'
import responseUtil from '../../components/utils/responseUtil';

class RelationActions {
  getViewablePeople() {
    return function(dispatch) {
      return fetch(process.env.API_ROOT + 'api/people/getViewablePeople', {
        method: 'GET', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
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

  getRelatedPeople(person) {
    return function(dispatch) {
      return fetch(process.env.API_ROOT + 'api/people/getRelatedPeople', {
        method: 'POST',
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          person: person
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

  makeDoctorPatientRelationship(doctor, patient) {
    return this.modifyDoctorPatientRelationship(doctor, patient, 'api/people/bindDoctorAndPatient')
  }

  destroyDoctorPatientRelationship(doctor, patient) {
    return this.modifyDoctorPatientRelationship(doctor, patient, 'api/people/unbindDoctorAndPatient');
  }

  modifyDoctorPatientRelationship(doctor, patient, api_route) {
    return function(dispatch) {
      return fetch(process.env.API_ROOT+''+api_route, {
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
    return this.modifyCaregiverPatientRelationship(caregiver, patient, 'api/people/bindCaregiverAndPatient');
  }

  destroyCaregiverPatientRelationship(caregiver, patient) {
    return this.modifyCaregiverPatientRelationship(caregiver, patient, 'api/people/unbindCaregiverAndPatient');
  }

  modifyCaregiverPatientRelationship(caregiver, patient, api_route) {
    console.log("Caregiver?");
    console.log(caregiver);
    console.log('Patient');
    console.log(patient);
    return function(dispatch) {
      return fetch(process.env.API_ROOT+''+api_route, {
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
