from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryInDB
from fastapi import Response
from loguru import logger
from typing import List

class CategoryService:
    @staticmethod
    def create_category(db: Session, category_data: CategoryCreate) -> Category:
        try:
            new_category = Category(
                category_name=category_data.category_name,
                description=category_data.description,
                category_image=category_data.category_image
            )
            db.add(new_category)
            db.commit()
            db.refresh(new_category)
            return new_category
        except Exception as e:
            logger.error(f"Error creating category: {e}")
            return Response(content="Failed to create category", status_code=500)

    @staticmethod
    def get_category(db: Session, category_id: int) -> Category:
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            logger.error(f"Category with id {category_id} not found")
            return Response(content="Category not found", status_code=404)
        return category

    @staticmethod
    def list_categories(db: Session) -> list[Category]:
        return db.query(Category).all()

    @staticmethod
    def update_category(db: Session, category_id: int, updated_data: CategoryUpdate) -> Category:
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            logger.error(f"Category with id {category_id} not found")
            return Response(content="Category not found", status_code=404)
        
        if updated_data.category_name is not None:
            category.category_name = updated_data.category_name
        if updated_data.description is not None:
            category.description = updated_data.description
        if updated_data.category_image is not None:
            category.category_image = updated_data.category_image
        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def delete_category(db: Session, category_id: int) -> None:
        category = db.query(Category).filter(Category.id == category_id).first()
        if not category:
            logger.error(f"Category with id {category_id} not found")
            return Response(content="Category not found", status_code=404)
        db.delete(category)
        db.commit()
        return Response(content="Category deleted successfully", status_code=200)

    @staticmethod
    def get_all_categories_with_services(db: Session) -> List[dict]:
        categories = db.query(Category).all()

        result = []
        for category in categories:
            services = [
                {
                    "id": service.id,
                    "service_title": service.service_title,
                    "service_price": float(service.service_price),  
                    "service_image": service.service_image,
                }
                for service in category.services  
            ]
            result.append({
                "id": category.id,
                "name": category.category_name,
                "description": category.description,
                "services": services,
            })

        return result
