const responseUtil = {
  // Success Response
  success: (res, data, message = "Success", statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  // Paginated Response
  successPaginated: (
    res,
    data,
    pagination,
    message = "Success",
    statusCode = 200,
  ) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: Math.ceil(pagination.total / pagination.limit),
        hasNextPage: pagination.page * pagination.limit < pagination.total,
        hasPrevPage: pagination.page > 1,
      },
      timestamp: new Date().toISOString(),
    });
  },

  // Error Response
  error: (res, message, code = "ERROR", statusCode = 400, details = null) => {
    const response = {
      success: false,
      message,
      code,
      timestamp: new Date().toISOString(),
    };

    if (details) {
      response.details = details;
    }

    res.status(statusCode).json(response);
  },

  // List Response
  list: (
    res,
    data,
    total,
    page,
    limit,
    message = "Success",
    statusCode = 200,
  ) => {
    const pages = Math.ceil(total / limit);
    res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNextPage: page < pages,
        hasPrevPage: page > 1,
      },
      timestamp: new Date().toISOString(),
    });
  },
};

module.exports = responseUtil;
