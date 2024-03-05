import domainApi from '../config/domainApi';


const isTokenValid = async (token :string) => {
  
    try {
      const response = await fetch(`${domainApi}/auth`, {
        method: 'GET',
        headers: {
          Authorization: `${token}`,
        },
      });
  
      if (response.ok) {
        return true;
      } else {
        return false
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      return false;
    }
  };
  
  export default isTokenValid;