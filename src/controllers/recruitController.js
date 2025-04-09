const { RecruitRequestDTO, RecruitResponseDTO } = require('../dtos/recruit');
const { createRecruit: createRecruitService, getRecruitById: getRecruitByIdService, getRecruits: getRecruitsService, getMyRecruits: getMyRecruitsService, updateRecruit: updateRecruitService, deleteRecruit: deleteRecruitService } = require('../services/recruitService');
const { asyncHandler } = require('../lib/utils/express/asyncHandler');

// 모집 공고 생성 컨트롤러
exports.createRecruit = asyncHandler(async (req, res, next) => {
    const requestDto = new RecruitRequestDTO(req.body);
    const userId = req.user.id;
    const responseDto = await createRecruitService(requestDto, userId);
    return res.status(201).json(responseDto.toJson());
});

// 모집 공고 단일 조회 컨트롤러 
exports.getRecruitById = asyncHandler(async (req, res, next) => {
    const recruitId = req.params.id;
    const responseDto = await getRecruitByIdService(recruitId);
    return res.status(200).json(responseDto.toJson());    
});

// 모집 공고 전제 조회 컨트롤러
exports.getRecruits = asyncHandler(async (req, res, next) => {
    const recruits = await getRecruitsService(); 
    return res.status(200).json({ 
        recruits: RecruitResponseDTO.fromList(recruits).map((r) => r.toJson())
    });
});

// 내 공고 조회 컨트롤러
exports.getMyRecruits = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const recruits = await getMyRecruitsService(userId);
    
    return res.status(200).json({
        myRecruits: RecruitResponseDTO.fromList(recruits).map((r) => r.toJson()) 
    });
    
});

// 모집 공고 수정 컨트롤러 
exports.updateRecruit = asyncHandler(async (req, res, next) => {
    const requestDto = new RecruitRequestDTO(req.body);
    const userId = req.user.id;
    const recruitId = req.params.id;
    const responseDto = await updateRecruitService(requestDto, userId, recruitId);
    return res.status(200).json(responseDto.toJson());
});

// 모집 공고 삭제 컨트롤러 
exports.deleteRecruit = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const recruitId = req.params.id;
    await deleteRecruitService(userId, recruitId);
    return res.status(200).json({
        deletedRecruitId: recruitId
    });
});
