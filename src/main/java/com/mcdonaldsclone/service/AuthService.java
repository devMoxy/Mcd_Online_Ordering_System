package com.mcdonaldsclone.service;

import com.mcdonaldsclone.dto.request.LoginRequest;
import com.mcdonaldsclone.dto.request.RegisterRequest;
import com.mcdonaldsclone.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}