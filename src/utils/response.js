function baseResponse({ Success = true, Message = '', Object = null, Errors = null }) {
  return { Success, Message, Object, Errors };
}

function paginatedResponse({ Success = true, Message = '', Objects = [], PageNumber, PageSize, TotalSize, Errors = null }) {
  return { Success, Message, Object: Objects, PageNumber, PageSize, TotalSize, Errors };
}

module.exports = { baseResponse, paginatedResponse };
