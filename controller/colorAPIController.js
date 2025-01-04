class ColourModel {
    constructor(id, image, color_C, color_M, color_Y, color_K, C_cost, M_cost, Y_cost, K_cost, fullCost, resolution, userEntity) {
        this.id = id;
        this.image = image;
        this.color_C = color_C;
        this.color_M = color_M;
        this.color_Y = color_Y;
        this.color_K = color_K;
        this.C_cost = C_cost;
        this.M_cost = M_cost;
        this.Y_cost = Y_cost;
        this.K_cost = K_cost;
        this.fullCost = fullCost;
        this.resolution = resolution;
        this.userEntity = userEntity;
    }
}

