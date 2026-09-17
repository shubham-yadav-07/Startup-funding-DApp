// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StartupFunding {

    address public owner;

    enum FundingStatus {
        NotApplied,
        Applied,
        Approved,
        Disbursed,
        Rejected
    }

    struct FundingApplication {

        address startup;

        string startupName;

        uint256 amount;

        FundingStatus status;
    }

    uint256 public applicationCount;

    mapping(uint256 => FundingApplication)
        public applications;


    event FundingApplied(
        uint256 indexed applicationId,
        address indexed startup,
        string startupName,
        uint256 amount
    );


    event FundingApproved(
        uint256 indexed applicationId
    );


    event FundsDisbursed(
        uint256 indexed applicationId,
        address indexed startup,
        uint256 amount
    );


    constructor() {

        owner = msg.sender;
    }


    modifier onlyOwner() {

        require(
            msg.sender == owner,
            "Only owner can perform this action"
        );

        _;
    }


    function applyFunding(
        string memory _startupName,
        uint256 _amount
    ) public {

        require(
            bytes(_startupName).length > 0,
            "Startup name required"
        );

        require(
            _amount > 0,
            "Funding amount must be greater than zero"
        );


        applicationCount++;


        applications[applicationCount] =
            FundingApplication({

                startup: msg.sender,

                startupName: _startupName,

                amount: _amount,

                status: FundingStatus.Applied
            });


        emit FundingApplied(
            applicationCount,
            msg.sender,
            _startupName,
            _amount
        );
    }


    function approveFunding(
        uint256 _applicationId
    )
        public
        onlyOwner
    {

        require(
            applications[_applicationId].startup
                != address(0),
            "Application does not exist"
        );


        require(
            applications[_applicationId].status
                == FundingStatus.Applied,
            "Application is not pending"
        );


        applications[_applicationId].status =
            FundingStatus.Approved;


        emit FundingApproved(
            _applicationId
        );
    }


    function disburseFunds(
        uint256 _applicationId
    )
        public
        payable
        onlyOwner
    {

        require(
            applications[_applicationId].startup
                != address(0),
            "Application does not exist"
        );


        require(
            applications[_applicationId].status
                == FundingStatus.Approved,
            "Funding must be approved first"
        );


        require(
            msg.value ==
                applications[_applicationId].amount,
            "Incorrect funding amount sent"
        );


        address payable startup =
            payable(
                applications[_applicationId].startup
            );


        applications[_applicationId].status =
            FundingStatus.Disbursed;


        startup.transfer(msg.value);


        emit FundsDisbursed(
            _applicationId,
            startup,
            msg.value
        );
    }


    function getFundingStatus(
        uint256 _applicationId
    )
        public
        view
        returns (
            address startup,
            string memory startupName,
            uint256 amount,
            FundingStatus status
        )
    {

        FundingApplication memory application =
            applications[_applicationId];


        return (
            application.startup,
            application.startupName,
            application.amount,
            application.status
        );
    }


    receive() external payable {}
}