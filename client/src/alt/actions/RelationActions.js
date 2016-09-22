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
        var craftedResponse = { data: { error: err, status: 'failure', message: err.message } };
        dispatch(craftedResponse);
        return craftedResponse;
      })
    }
  }
}

export default alt.createActions(RelationActions);