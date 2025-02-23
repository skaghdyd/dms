package com.td.dms.service;

import com.td.dms.entity.Folder;
import com.td.dms.entity.User;
import com.td.dms.repository.FolderRepository;
import com.td.dms.repository.UserRepository;
import com.td.dms.dto.FolderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FolderService {
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    @Transactional
    public FolderResponse createFolder(String name, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (folderRepository.existsByNameAndCreatedBy(name, user)) {
            throw new RuntimeException("이미 존재하는 폴더 이름입니다.");
        }

        Folder folder = new Folder();
        folder.setName(name);
        folder.setCreatedBy(user);

        folder = folderRepository.save(folder);
        return convertToResponse(folder);
    }

    @Transactional(readOnly = true)
    public List<FolderResponse> getFoldersByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        List<Object[]> foldersWithCount = folderRepository.findFoldersWithDocumentCount(user);

        return foldersWithCount.stream()
                .map(row -> FolderResponse.builder()
                        .id((Long) row[0])
                        .name((String) row[1])
                        .documentCount(((Long) row[2]).intValue())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public FolderResponse updateFolder(Long id, String name, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Folder folder = folderRepository.findByIdAndCreatedBy(id, user)
                .orElseThrow(() -> new RuntimeException("폴더를 찾을 수 없습니다."));

        if (!folder.getName().equals(name) &&
                folderRepository.existsByNameAndCreatedBy(name, user)) {
            throw new RuntimeException("이미 존재하는 폴더 이름입니다.");
        }

        folder.setName(name);
        folder = folderRepository.save(folder);
        return convertToResponse(folder);
    }

    @Transactional
    public void deleteFolder(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Folder folder = folderRepository.findByIdAndCreatedBy(id, user)
                .orElseThrow(() -> new RuntimeException("폴더를 찾을 수 없습니다."));

        if (!folder.getDocuments().isEmpty()) {
            throw new RuntimeException("폴더에 문서가 있어 삭제할 수 없습니다.");
        }

        folderRepository.delete(folder);
    }

    private FolderResponse convertToResponse(Folder folder) {
        return FolderResponse.builder()
                .id(folder.getId())
                .name(folder.getName())
                .documentCount(folder.getDocuments().size())
                .build();
    }
}